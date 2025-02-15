
interface CustomButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const CustomButton = ({ onClick, children }: CustomButtonProps) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
};