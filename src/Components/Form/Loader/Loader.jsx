import ContentLoader from "react-content-loader";

const Loader = () => (
    <ContentLoader
      speed={2}
      width={200}
      height={50}
      viewBox="0 0 200 50"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="15" rx="5" ry="5" width="150" height="10" />
      <rect x="0" y="30" rx="5" ry="5" width="100" height="10" />
    </ContentLoader>
  );

export default Loader;