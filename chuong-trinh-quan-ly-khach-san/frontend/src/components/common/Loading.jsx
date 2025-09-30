const Loading = ({ message = "Đang tải..." }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
};

export default Loading;
