import { MapPin, MessageCircle } from "lucide-react";

const PROPERTIES = [
{
  image: "https://customer-assets.emergentagent.com/job_beml-homes-expert/artifacts/6gkdmbhg_Listing_1.webp",
  location: "Subhramanyapura, Bengaluru",
  type: "Residential Property",
  size: "1200 sq ft",
  price: "₹1.62 Crore",
  status: "Available Now",
  statusColor: "bg-green-100 text-green-700",
  whatsappMsg: "Hi Vishal, I'm interested in the 1200 sqft property at Subhramanyapura priced at Rs. 1.62 Crore. Please share more details."
},
{
  image: "https://customer-assets.emergentagent.com/job_beml-homes-expert/artifacts/hr1ip25t_Listing_2.webp",
  location: "JP Nagar, Bengaluru",
  type: "Independent House",
  size: "1200 sq ft",
  price: "₹1.62 Crore",
  status: "Available Now",
  statusColor: "bg-green-100 text-green-700",
  whatsappMsg: "Hi Vishal, I'm interested in the 1200 sqft house at JP Nagar priced at Rs. 1.62 Crore. Please share more details."
},
{
  image: "https://customer-assets.emergentagent.com/job_beml-homes-expert/artifacts/nwy6z5z2_Listing_3.webp",
  location: "RR Nagar, Bengaluru",
  type: "Residential Property",
  size: "8900 sq ft",
  price: "₹12 Crore",
  status: "Available Now",
  statusColor: "bg-green-100 text-green-700",
  whatsappMsg: "Hi Vishal, I'm interested in the 8900 sqft property at RR Nagar priced at Rs. 12 Crore. Please share more details."
},
{
  image: "https://images.unsplash.com/photo-1600596542815-2495db98dada?w=600&q=80&auto=format&fit=crop",
  location: "BEML Layout, RR Nagar",
  type: "2BHK Apartment",
  size: "Coming Soon",
  price: "Price on Request",
  status: "Coming Soon",
  statusColor: "bg-amber-100 text-amber-700",
  whatsappMsg: "Hi Vishal, I'm interested in 2BHK apartments in BEML Layout. Please share more details."
},
{
  image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80&auto=format&fit=crop",
  location: "BEML Layout, RR Nagar",
  type: "3BHK Villa",
  size: "Coming Soon",
  price: "Price on Request",
  status: "Coming Soon",
  statusColor: "bg-amber-100 text-amber-700",
  whatsappMsg: "Hi Vishal, I'm interested in 3BHK villas in BEML Layout. Please share more details."
},
{
  image: "https://images.unsplash.com/photo-1600566753086-00f18cf27f43?w=600&q=80&auto=format&fit=crop",
  location: "Rajarajeshwari Nagar",
  type: "Commercial Space",
  size: "Coming Soon",
  price: "Price on Request",
  status: "Coming Soon",
  statusColor: "bg-amber-100 text-amber-700",
  whatsappMsg: "Hi Vishal, I'm interested in commercial spaces in Rajarajeshwari Nagar. Please share more details."
}];


export default function PropertiesSection() {
  return (
    <section id="properties" className="py-16 md:py-24 bg-white" data-testid="properties-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Our Listings
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Properties Across Bengaluru

          </h2>
          <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">Handpicked by Our Expert Team. Every listing is verified and honestly priced.

          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPERTIES.map((prop, i) =>
          <div
            key={i}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            data-testid={`property-card-${i + 1}`}>

              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <img
                src={prop.image}
                alt={`${prop.type} in ${prop.location}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy" />

                {/* Status */}
                <span
                className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${prop.statusColor}`}>

                  {prop.status}
                </span>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                  href={`https://wa.me/918310216700?text=${encodeURIComponent(prop.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
                  data-testid={`property-view-${i + 1}`}>

                    <MessageCircle size={16} />
                    View Details
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start gap-1.5 mb-1.5">
                  <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-500">{prop.location}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5">{prop.type}</h3>
                <p className="text-xs text-gray-400 mb-4">{prop.size}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">{prop.price}</span>
                  <a
                  href={`https://wa.me/918310216700?text=${encodeURIComponent(prop.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">

                    Details &rarr;
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm mb-4">Didn't find your match? Let our experts show you more options.

          </p>
          <a
            href="https://wa.me/918310216700?text=Hi%20Vishal%2C%20I%27m%20looking%20for%20properties%20in%20BEML%20Layout.%20Can%20you%20help?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-md shadow-green-100"
            data-testid="all-properties-cta">

            <MessageCircle size={16} />
            Ask About More Properties
          </a>
        </div>
      </div>
    </section>);

}