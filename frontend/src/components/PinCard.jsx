import { Link } from "react-router-dom";

const PinCard = ({ pin }) => {
  return (
    <Link to={`/pin/${pin._id}`} className="block">
      <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white">
        <div className="aspect-[2/3] w-full relative">
          <img
            src={pin.image?.url || "/placeholder.jpg"}
            alt={pin.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
            <div className="text-white w-full">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {pin.title}
              </h3>
              <p className="text-sm opacity-90 line-clamp-1">
                {pin.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PinCard;
