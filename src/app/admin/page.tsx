import Link from "next/link";

export default function AdminPage() {
  return (
    <section>
      <div>Admin Pages</div>
      <div>
        <Link href="/admin/item-insert">Insert an item into store</Link>
      </div>
      <div>
        <Link href="/admin/items">Check Store and Edit an item from store</Link>
      </div>
      <div>
        <Link href="/admin/item-away">Check Pending Order</Link>
      </div>
      <div>
        <Link href="/admin/types-edit">Create a new item type or edit existing</Link>
      </div>
      <div>
        <Link href="/admin/category-edit">Create new category or edit existing</Link>
      </div>
      <div>
        <Link href="/admin/extend-item-away">Process Extend Orders </Link>
      </div>
    </section>
  );
}
