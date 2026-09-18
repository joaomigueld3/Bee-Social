import './Skeleton.css';

export default function Skeleton() {
  return (
    <div className="skeletonCard" aria-hidden="true">
      <div className="skeletonTitle" />
      <div className="skeletonLine" />
      <div className="skeletonLine skeletonLineShort" />
      <div className="skeletonTags">
        <div className="skeletonTag" />
        <div className="skeletonTag" />
        <div className="skeletonTag" />
      </div>
    </div>
  );
}
