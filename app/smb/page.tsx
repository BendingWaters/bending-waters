import MarketPage from "@/components/marketing/marketing-pages";
import BusinessRegistrationCTA from "./_components/BusinessRegistrationCTA";

export default function SMBPage() {
  return (
    <MarketPage
      page="smb"
      slots={{
        afterFeaturePanel: <BusinessRegistrationCTA  />,
      }}
    />
  );
}
