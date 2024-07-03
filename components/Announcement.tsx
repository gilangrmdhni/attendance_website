const Announcement = () => {
  return (
    <section className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Announcement</h2>
        <a href="#" className="text-blue-800 text-xs">See All</a>
      </div>
      <div className="space-y-4">
        <div className="flex items-center border-b pb-2">
          <img src="/images/news1.png" alt="Announcement 1" className="w-16 h-16 rounded-md mr-4" />
          <div>
            <p className="text-sm text-gray-500">Rabu, 32 Juni 2024</p>
            <p className="font-semibold">Jadwal WFO September 2024</p>
            <p className="text-sm text-gray-600">Biar gampang dapetin info promo, bukt...</p>
          </div>
        </div>
        <div className="flex items-center border-b pb-2">
          <img src="/images/news2.png" alt="Announcement 2" className="w-16 h-16 rounded-md mr-4" />
          <div>
            <p className="text-sm text-gray-500">Rabu, 32 Juni 2024</p>
            <p className="font-semibold">Jadwal WFO September 2024</p>
            <p className="text-sm text-gray-600">Biar gampang dapetin info promo, bukt...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcement;
