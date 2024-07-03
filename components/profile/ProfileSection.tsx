const ProfileSection = ({ title, items }: { title: string; items: any[] }) => {
    return (
      <section className="bg-white p-4 rounded-lg shadow-md mb-4">
        {title && <h2 className="font-semibold mb-2">{title}</h2>}
        <div className="border-t border-gray-200">
          {items.map((item, index) => (
            <a href="#" key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">{item.name}</span>
              <img src={item.isLogout ? "/images/logout.png" : "/images/arrow-circle-right.png"} alt="Icon" className="w-4 h-4" />
            </a>
          ))}
        </div>
      </section>
    );
  };
  
  export default ProfileSection;
  