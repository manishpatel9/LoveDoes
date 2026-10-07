import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminMe, adminPage } from "../../services/api.js";

export default function AdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    adminMe()
      .then(() => adminPage(id))
      .then(setData)
      .catch(() => navigate("/admin/login"));
  }, [id, navigate]);

  if (!data) return <div className="admin-shell"><p>Loading…</p></div>;
  const { page, photos, memories } = data;

  return (
    <div className="admin-shell">
      <Link to="/admin">← Dashboard</Link>
      <div className="card" style={{ marginTop: 16 }}>
        <h1>{page.creator_name} ❤️ {page.partner_name}</h1>
        <p>Occasion: {page.occasion} · Date: {page.special_date || "—"}</p>
        <p>Slug: {page.slug}</p>
        <p>Message: {page.message}</p>
        <p>Audio: {page.audio_url || "none"}</p>
        <p>Created: {new Date(page.created_at).toLocaleString()}</p>
        <div className="masonry">
          {photos.map((ph) => (
            <img key={ph.file_url} src={ph.file_url} alt={ph.type} />
          ))}
        </div>
        <ul>
          {memories.map((m) => (
            <li key={`${m.title}-${m.memory_date}`}>{m.title}: {m.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
