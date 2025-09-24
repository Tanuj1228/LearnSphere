# LearnSphere
[![Node.js](https://img.shields.io/badge/Node.js-v20-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.0-green?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/<your-username>/LearnSphere?style=social)](https://github.com/<your-username>/LearnSphere/stargazers)

**A Centralized Knowledge Hub for B.Tech Students**  

LearnSphere is a web-based platform designed to **centralize and organize academic resources** for B.Tech students. Students can securely **register, log in, upload, download, and browse study materials**, creating a collaborative knowledge-sharing environment. Inspired by [LetsHelp.co.in](https://www.letshelp.co.in).  

---

## **🚀 Features**
- **Secure Authentication:** Registration & login using JWT and bcrypt password hashing.
- **File Upload & Download:** Upload PDFs, PPTs, DOC files; download with a single click.
- **Dynamic Dashboard:** EJS templates for interactive and responsive content rendering.
- **Metadata Management:** File info like uploader, year, subject, description stored in MongoDB.
- **Access Control:** Only authenticated users can upload/download files.
- **Local Storage:** Phase 1 uses server-side storage; cloud storage planned in future phases.

---

## **💻 Tech Stack**
- **Frontend:** HTML, CSS, JavaScript, EJS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT, bcrypt.js  
- **File Storage:** Local uploads folder  
- **Future Enhancements:** Docker, AWS, Redis caching, WebSockets  

---

## **⚙️ Installation**

1.  **Clone the repository:**
    `git clone https://github.com/LearnSphere.git LearnSphere`

2.  **Install dependencies:**
    `npm install`

3.  **Set up environment variables:**
    Create a `.env` file in the root directory with the following variables:
    `MONGO_URI=`
    `JWT_SECRET=`
    `PORT=3000`

4.  **Start the application:**
    `npm start`

5.  **Open in browser:**
    `http://localhost:3000`

---

## Usage

Register a new student account. Log in using your credentials. Upload study materials (PDF, PPT, DOC). Browse and download files. The dashboard dynamically updates with new files and metadata.

---

## Future Enhancements

* **Real-time commenting and rating:** (WebSockets)
* **Redis caching:** for faster file retrieval
* **Cloud storage:** using AWS S3
* **Admin panel:** for content management
* **Global deployment:** using Docker and AWS

---

## References

* [LetsHelp.co.in](https://LetsHelp.co.in) - Reference for structure and features
* MongoDB Documentation
* Node.js Documentation
* Express.js Documentation
* JWT Documentation

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).