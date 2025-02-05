const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Unauthorized Access
        </h2>
        <p className="text-slate-600">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
