
interface DetailItemProps {
  label: string,
  value: string | number,
  className?: string
}
const DetailItem = ({label, value, className}:DetailItemProps) => {
  return (
    <div className={className}>
      <h3 className={`text-sm font-medium text-gray-500`}>{label}</h3>
      <p className={`mt-1 text-sm`}>{value || <span className={`text-gray-400`}>Not specified</span>}</p>
    </div>
  );
};
export default DetailItem;
