import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { Buffer } from "buffer";

const prisma = new PrismaClient();
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export async function POST(request: Request) {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const author = formData.get("author") as string | null;
  const quantity = formData.get("quantity") as string;
  const category = formData.get("category") as string;
  const type = formData.get("type") as string;
  const image = formData.get("image") as Blob | null;

  let imageUrl = "";

  if (image) {
    const imageKey = `${randomUUID()}-${formData.get("imageName") ?? "image"}`;

    try {
      const imageBuffer = Buffer.from(await image.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: imageKey,
          Body: imageBuffer,
          ContentType: image.type,
        })
      );

      imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
    }
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        name: title,
        author: author || null,
        quantity: Number(quantity),
        categoryId: Number(category),
        typeId: Number(type),
        image: imageUrl,
      },
    });

    return NextResponse.json({ message: "Item submitted successfully", item: newItem }, { status: 200 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ message: "Failed to create item" }, { status: 500 });
  }
}
