type MediaCardProps = {
  title: string;
  type: string;
  url: string;
};

export default function MediaCard({
  title,
  type,
  url,
}: MediaCardProps) {
  return (
    <div className="card shadow-sm border-0 h-100">
      {/* Image Preview */}
      {type.startsWith("image") ? (
        <img
          src={url}
          alt={title}
          className="card-img-top"
          style={{
            height: "250px",
            objectFit: "cover",
          }}
        />
      ) : (
        <div className="p-3">
          <audio controls className="w-100">
            <source src={url} type={type} />
          </audio>
        </div>
      )}

      <div className="card-body">
        <h5 className="card-title text-truncate">
          {title}
        </h5>

        <p className="text-muted small">
          {type}
        </p>
      </div>
    </div>
  );
}