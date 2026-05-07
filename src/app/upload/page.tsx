import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <section className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <UploadForm />
          </div>
        </div>
      </div>
    </section>
  );
}