const RecentActivity = () => {
  const activities = [
    { type: 'student', message: 'New student John Doe enrolled', time: '2 hours ago' },
    { type: 'course', message: 'Mathematics course updated', time: '4 hours ago' },
    { type: 'schedule', message: 'Class schedule for next week published', time: '6 hours ago' },
    { type: 'report', message: 'Monthly attendance report generated', time: '1 day ago' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RecentActivity;