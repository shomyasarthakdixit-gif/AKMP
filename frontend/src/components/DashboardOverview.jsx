import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardOverview() {
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'ROLE_USER';
  const token = localStorage.getItem('token');
  
  const [statsData, setStatsData] = useState({
    courses: 0,
    categories: 0,
    users: 0,
    reviews: 0,
    recentCourses: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [courseRes, catRes, userRes, reviewRes] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/sql/courses', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/v1/sql/categories', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/v1/auth/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/v1/nosql/reviews/stats/total', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { totalReviews: 0 } }))
        ]);

        const courses = courseRes.data || [];
        const cats = catRes.data || [];
        const usersList = userRes.data || [];
        const totalReviews = reviewRes.data?.totalReviews || 0;

        // Sort by ID descending
        const recent = [...courses].sort((a, b) => b.id - a.id).slice(0, 5);

        setStatsData({
          courses: courses.length,
          categories: cats.length,
          users: usersList.length,
          reviews: totalReviews,
          recentCourses: recent
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const stats = [
    { title: "Total Courses", value: isLoading ? "..." : statsData.courses, change: "All time", color: "from-blue-500 to-cyan-400" },
    { title: "Active Categories", value: isLoading ? "..." : statsData.categories, change: "All time", color: "from-emerald-500 to-teal-400" },
    { title: "Team Members", value: isLoading ? "..." : statsData.users, change: "Registered", color: "from-purple-500 to-indigo-400" },
    { title: "Course Reviews", value: isLoading ? "..." : statsData.reviews, change: "Total Feedback", color: "from-orange-500 to-pink-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-8 md:p-12 shadow-xl border border-slate-800 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl group-hover:bg-blue-400/40 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{username}</span>!
            </h2>
            <p className="text-slate-300 text-lg max-w-xl">
              Here is what's happening in your knowledge base today. You have {isLoading ? '...' : statsData.courses} courses currently managed.
            </p>
          </div>
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-500">
            <span className="text-4xl">🚀</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="group relative bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -mr-10 -mt-10`}></div>
            
            <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
              <span className={`text-sm font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary`}>
                {stat.change}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/50 transition-all duration-500"></div>
          </div>
        ))}
      </div>
      
      {/* Recent Courses */}
      <div className="mt-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Recent Courses</h3>
        {isLoading ? (
          <div className="py-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : statsData.recentCourses.length > 0 ? (
          <div className="space-y-3">
            {statsData.recentCourses.map((course, idx) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50 hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{course.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                    {course.category?.name || 'Uncategorized'}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">By {course.author?.username || 'Unknown'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">No Courses Yet</h3>
            <p className="text-muted-foreground max-w-md">No courses have been added to the platform yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
