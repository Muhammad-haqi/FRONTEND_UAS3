export default function PesanItem({ title, children }) {
  return (
    <div className="pesan-card">
      <h3 className="pesan-title">{title}</h3>
      {children}
    </div>
  );
}