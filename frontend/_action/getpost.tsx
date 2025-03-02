
const GetPost = async (userId: string | undefined) => { 
    if (!userId) return [];
  
    try {
      const response = await fetch(`http://localhost:3001/userpost?q=${userId}`, {
        method:"GET", 
        cache:"no-cache"
      });
      const result = await response.json();
      if (Array.isArray(result.message)) {
        return result.message;
      }
  
      return []; 
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
      return [];
    }
  };
  

export default GetPost
