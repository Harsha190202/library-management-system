import Header from "@/components/Header";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
export default function Home() {
  return (
    <main>
      <section className="top">
        <Header />

        <div className="topp">
          <div className="top-left">
            <h3>Start Your Reading Journey</h3>
            <h1>Where every book is new a Adventure</h1>
            <p>From classics to science-fiction , our library offers a wide section of books that suit your taste</p>
            <p>start exploring our book shelves today and uncover hidden gems</p>

            <Link href="/store" className="top-left-link">
              <SearchIcon></SearchIcon>
              Search Books
            </Link>
          </div>
          <div className="top-right">
            <div className="top-right1">
              <Image src="/30ghostship.jpg" alt="ghostshipbook" width={160} height={160} />
            </div>
            <div className="top-right2">
              <Image src="/magazine-cover-1.jpg" alt="magazine" width={160} height={160} />
            </div>
            <div className="top-right3">
              <Image src="/27harrypotterandsorcerersstone.webp" alt="harrypotter" width={160} height={160} />
            </div>
          </div>
        </div>
      </section>
      <section className="middle">
        <h1> What We Offer </h1>
        <div className="middlelower">
          <div className="middlelower-item">
            <Image className="middlelower-item-Image" src="/18The-Invisible-Man.webp" alt="invinsibe-man" width={200} height={200} />
            <h3>Books</h3>
          </div>
          <div className="middlelower-item">
            <Image className="middlelower-item-Image" src="/bus-magazine.jpg" alt="Magazine" width={200} height={200} />
            <h3>Magazines</h3>
          </div>
          <div className="middlelower-item">
            <Image className="middlelower-item-Image" src="/Article.jpg" alt="article" width={200} height={200} />
            <h3>Articles</h3>
          </div>
          <div className="middlelower-item">
            <Image className="middlelower-item-Image" src="/news.jpg" alt="newsletter" width={200} height={200} />
            <h3>News Letters</h3>
          </div>
        </div>
      </section>
      <section className="lowest flex">
        <div className="lowest-left">
          <h2>So why wait now , go out to our near by library and grab a book </h2>
          <h5>Create an account before you borrow</h5>
        </div>
        <Link className="lowest-Link" href="/sign-up">
          {" "}
          Create Account{" "}
        </Link>
      </section>

      <section className="popular">
        <h1>Our most popular books </h1>
      </section>
    </main>
  );
}
