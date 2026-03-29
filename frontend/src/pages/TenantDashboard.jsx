import { useState } from "react";
import TenantNavbar     from "../components/tenant/TenantNavbar";
import TenantHero       from "../components/tenant/TenantHero";
import SearchFilter     from "../components/tenant/SearchFilter";
import PropertyGrid     from "../components/tenant/PropertyGrid";
import RentRequestModal from "../components/tenant/RentRequestModal";
import Footer           from "../components/Footer";

export default function TenantDashboard() {
  const [filters,          setFilters]          = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);

  return (
    <div className="min-h-screen bg-cream">
      <TenantNavbar />
      <TenantHero onSearch={(q) => setFilters((f) => ({ ...f, ...q }))} />

      <main className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 orange-gradient rounded-full" />
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal">Available Properties</h2>
            <p className="font-body text-sm text-charcoal/45">Browse all verified listings</p>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <SearchFilter onFilter={(f) => setFilters(f)} />
          <PropertyGrid filters={filters} onRequestRent={(p) => setSelectedProperty(p)} />
        </div>
      </main>

      <Footer />

      {selectedProperty && (
        <RentRequestModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}
    </div>
  );
}
