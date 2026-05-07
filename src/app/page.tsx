import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-dark text-light py-5">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Pulse Gallery
              </h1>

              <p className="lead mb-4">
                A cloud-native multimedia sharing platform built with
                Next.js, Azure Blob Storage, Cosmos DB, Docker,
                and Terraform.
              </p>

              <div className="d-flex gap-3">
                <Link href="/upload" className="btn btn-primary btn-lg">
                  Upload Media
                </Link>

                <Link href="/gallery" className="btn btn-outline-light btn-lg">
                  View Gallery
                </Link>
              </div>
            </div>

            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                alt="Cloud Native"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Platform Features</h2>

            <p className="text-muted">
              Built using modern cloud-native technologies
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <h3 className="mb-3">Azure Blob Storage</h3>

                  <p>
                    Secure and scalable media storage for images
                    and audio uploads.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <h3 className="mb-3">Cosmos DB</h3>

                  <p>
                    Stores metadata efficiently using a globally
                    distributed NoSQL database.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <h3 className="mb-3">Cloud-Native Deployment</h3>

                  <p>
                    Containerized using Docker and deployed
                    on Microsoft Azure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">
            Start Sharing Your Media
          </h2>

          <p className="lead mb-4">
            Upload images and audio files securely to the cloud.
          </p>

          <Link href="/upload" className="btn btn-light btn-lg">
            Go to Upload Page
          </Link>
        </div>
      </section>
    </>
  );
}