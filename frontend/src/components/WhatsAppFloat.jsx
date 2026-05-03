import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/918310216700?text=Hi%20Kishan%2C%20I%27m%20interested%20in%20properties%20in%20BEML%20Layout.%20Can%20you%20help?"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
      aria-label="Chat on WhatsApp"
      data-testid="whatsapp-float-btn"
    >
      <MessageCircle size={26} fill="white" strokeWidth={1.5} />
    </a>
  );
}
