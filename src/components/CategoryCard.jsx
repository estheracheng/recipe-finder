export default function CategoryCard({ name, image }) {
  return (
    <div className="relative min-w-[200px] h-[200px] rounded-xl overflow-hidden shadow-md cursor-pointer group">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span className="text-white text-xl font-semibold">{name}</span>
      </div>
    </div>
  );
}
