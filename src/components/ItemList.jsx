import ItemCard from './ItemCard';

export default function ItemList({ items, onUpdate, onRemove, onDuplicate, onToggle, onFileAdd, onFileRemove, showToast }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-folder-open" style={{ fontSize: '2.5rem', color: '#c7d7f8', marginBottom: 12 }} />
        <p style={{ color: '#6b7f99', fontSize: '0.95rem', marginBottom: 4 }}><strong>Nenhum item adicionado ainda.</strong></p>
        <p style={{ color: '#8a9ab5', fontSize: '0.83rem' }}>Use o botão <strong>"+ Adicionar à lista"</strong> acima para começar a lançar seus comprovantes.</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item, index) => (
        <ItemCard
          key={item.id}
          item={item}
          index={index}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
          onToggle={onToggle}
          onFileAdd={onFileAdd}
          onFileRemove={onFileRemove}
          showToast={showToast}
        />
      ))}
    </div>
  );
}
