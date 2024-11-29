// Import the serve function from Deno's standard library
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

    // Handler function to process incoming HTTP requests
    const handler = async (request: Request): Promise<Response> => {
      try {
        const url = new URL(request.url);
        let filepath = "." + url.pathname;
        
        if (filepath === "./") {
          filepath = "./index.html"; // Serve index.html by default
        }

        // Read the requested file from the filesystem
        const file = await Deno.readTextFile(filepath);
        const contentType = filepath.toLowerCase().endsWith(".html") ? "text/html" :
                           filepath.toLowerCase().endsWith(".js") ? "application/javascript" :
                           filepath.toLowerCase().endsWith(".ts") ? "application/javascript" :
                           filepath.toLowerCase().endsWith(".css") ? "text/css" :
                           "text/plain";

        // Return the file content with appropriate headers
        return new Response(file, {
          headers: {
            "content-type": `${contentType}; charset=utf-8`,
            "access-control-allow-origin": "*"
          },
        });
      } catch (error) {
        console.error(error);
        return new Response("404 Not Found", { status: 404 }); // Handle file not found errors
      }
    };

    console.log("HTTP webserver running at http://localhost:3001");
    await serve(handler, { port: 3001 }); // Start the server on port 3001
