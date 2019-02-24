# tv-sofia-backend

The backend for tv-sofia, a simple media server and web player with 
scheduling I've developed 'for my daughter

# Installing

Clone the repo, install the dependencies and create a symbolic link 
called 'videos' pointing to your folder where you keep your videos 
neatly organized in subfolders.


    git clone https://github.com/rodrigonsh/tv-sofia-backend
    
    cd tv-sofia-backend
    
    npm install
    
    ln -s /path/to/your-videos ./videos

# Config

Rename app/js/config.example.js to config.js and edit it 
to schedule playback of specific folders


# Run

Run the backend to serve the files on your local network

    
    node index.js


