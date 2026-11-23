import AdminLayout from './adminLayout.jsx'

function EquipmentCategories({ setPath }) {
  const categories = ['Desktop and Laptop', 'Monitors', 'Projectors', 'Printers', 'Networking', 'Air Conditioning']
  return (
    <AdminLayout setPath={setPath} active="categories" title="Equipment Categories">
      <section className="admin-panel">
        <div className="panel-heading"><div><h2>Equipment Categories</h2><p>Organize equipment types</p></div><button className="primary-action">+ Add Category</button></div>
        <div className="category-grid">{categories.map((name, index) => <article key={name}><div className="category-icon">▣</div><div><h3>{name}</h3><p>{index === 0 ? 12 : index + 4} equipment items</p></div><button>Edit</button></article>)}</div>
      </section>
    </AdminLayout>
  )
}
export default EquipmentCategories
