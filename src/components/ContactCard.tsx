export default function ContactCard({
  title,
  phone,
  email,
  hours,
}: {
  title: string;
  phone: string;
  email?: string;
  hours?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-primary">{title}</h3>
      <p className="mt-1 text-sm">
        <span className="text-gray-500">Phone:</span>{" "}
        <a href={`tel:${phone}`} className="font-medium">
          {phone}
        </a>
      </p>
      {email && (
        <p className="text-sm">
          <span className="text-gray-500">Email:</span>{" "}
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}
      {hours && (
        <p className="text-sm text-gray-500">{hours}</p>
      )}
    </div>
  );
}
