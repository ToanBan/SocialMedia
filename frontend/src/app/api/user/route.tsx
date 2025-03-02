

export async function GET() {
    const res = await fetch('http://localhost:3001/getuser', {
        method:"GET", 
        credentials: 'include',
    })

    const data = await res.json();  
    return Response.json({data});
}
