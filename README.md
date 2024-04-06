<h1 align="center" style="font:'almarai'">Faris social</h1>



## 🚩 Table of Contents

- [Introduction](#--introduction)
- [Installation](#--installation)
- [Development setup](#--development-setup)
- [Packages](#-packages)
- [License](#-license)




## <img src="https://cdn-icons-png.flaticon.com/512/1436/1436664.png" width="25" height="25" style="padding-right:15px">  Introduction 

<p>
Welcome to Faris Social, your all-in-one social media platform!

Faris Social offers a unique blend of features from your favorite social media platforms like Facebook, Twitter, Reddit, and Instagram, all in one convenient place. Whether you’re looking to connect with friends, share updates, discover interesting content, or engage with like-minded individuals, Faris Social has you covered.

Faris Social is a cutting-edge social media platform built with the T3 stack, leveraging Next.js, TypeScript, Tailwind CSS, and tRPC to deliver a robust and scalable application. Here’s a deeper look at the technical components powering Faris Social:

- NextJs: Next.js is the foundation of Faris Social, providing server-side rendering, static site generation , Incremental Static Regeneration, and a powerful React framework for building modern web applications.
- TypeScript: Faris Social is developed entirely in TypeScript, ensuring type safety throughout the codebase and facilitating easier maintenance and refactoring.
- Tailwind CSS: Tailwind CSS is used for styling and UI components, providing a utility-first approach that streamlines development and enables rapid iteration.
- tRPC: tRPC is employed for full type safety in API communication, allowing for seamless integration between the frontend and backend while minimizing runtime errors.
- Drizzle ORM and Prisma ORM: Faris Social utilizes both Drizzle ORM and Prisma ORM for database access, enabling efficient data storage and retrieval with support for relational data modeling.
- Radix UI: The headless UI library Radix is integrated into Faris Social, offering a collection of accessible, customizable components for building a modern user interface.
- Shadcn UI: Faris Social incorporates Shadcn UI, a collection of accessible and customizable components that you can easily integrate into your applications. It provides a free and open-source solution for building your own component library, enabling rapid development and customization while ensuring accessibility and responsiveness.
- bcrypt: Faris Social utilizes bcrypt, a password hashing function, to securely encrypt all passwords before storing them in the database. bcrypt is a one-way hashing algorithm, ensuring that passwords cannot be decrypted or “dehashed.” This robust security measure safeguards user credentials and protects against unauthorized access.
- Image Compression: I implement a custom image compression process to optimize the storage and transmission of images uploaded by users. The compression algorithm is designed to convert images to the WebP format with adjustable quality settings, ensuring efficient utilization of bandwidth and storage resources.
- Dark/Light Mode Support: Faris Social offers support for both dark and light mode themes, implemented using Tailwind CSS utility classes for seamless switching between visual preferences.
- Multi-Language Support: Faris Social supports multiple languages thanks to Next.js and the i18next library, allowing users to experience the platform in their preferred language with ease.
- Real-Time Connection: Faris Social utilizes a real-time connection through Pusher, enabling instant updates and notifications to users in response to events and interactions on the platform.
- Redis DB: Faris Social leverages the Redis cache database for rate limiting and efficient retrieval of user sessions. This integration enhances the platform’s security and performance by mitigating the risk of denial-of-service (DoS) attacks and facilitating rapid access to user session data.
- AI Integration: Faris Social integrates AI capabilities for various tasks, including local AI processing using Olama, LLava, and Mistral for enhanced content moderation, user recommendations, and personalized experiences , for production , It's recommended to use ChatGPT or Gemini APIs.

</br>

</p>


## <img src="https://cdn-icons-png.flaticon.com/512/814/814848.png" width="25" height="25" style="padding-right:15px">  Installation 


### 🔘 Cloning repository
1. On GitHub.com, navigate to the main page of the repository.
2. Above the list of files, click  Code.
3. Copy the URL for the repository.
4. Open Terminal.
5. Change the current working directory to the location where you want the cloned directory.
6. Type git clone, and then paste the URL you copied earlier.
```
git clone github.com/Faris-abukhader/faris-social-media-app
```
Press Enter to create your local clone
```
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
> Cloning into `faris-social-media-app`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remove: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.
```
<br/>


## <img src="https://cdn-icons-png.flaticon.com/512/814/814848.png" width="25" height="25" style="padding-right:15px">  Development setup

To set up the project, you need to download NodeJs & python on your computer, if you already have it make sure it's the latest version.

### 🔘 Checking NodeJs Version

```
node -v
```

### 🔘 Checking Python Version
 
```
python3 --version
```

<br/>


### 🔘 Downloading NodeJs


> For Windows Users
- You can download the Windows version through the official NodeJs page, make sure to download the latest available version.
 [Official Page](https://nodejs.org/en/download/)

<br/>

> For Mac Users 
- NodeJs can be downloaded via brew commands 

```
brew install node
```
- You can also download the Mac version through the [Official Page](https://nodejs.org/en/download/)

<br/>

### 🔘 Downloading Python


> For Windows Users
- You can download the Windows version through the official Python page, make sure to download the latest available version.
 [Official Page](https://www.python.org/downloads/)

<br/>

> For Mac Users 
- Python can be downloaded via brew commands 


```
brew install python
```

- You can also download the Mac version through the [Official Page](https://www.python.org/downloads/)


<hr/>


### 🔘 Downloading Necessary Libraries 

To download the AI server code libraries, navigate to the ai-api directory and enter the command:

```
pip install -r requirements.txt
```

To download the frontend libraries, navigate to the project directory and enter the command:

```
pnpm install 
```


To run the ai-api server, enter the following command:

```
uvicorn app:app --reload
```

To run the frontend, enter the following command: 

```
pnpm dev
```

<br/>

## 📦 Packages

| Name | Description |
| --- | --- |
| [NextJs](https://nextjs.org) | Next.js enables you to create high-quality web applications with the power of React components. |
| [Prisma ORM](https://www.prisma.io) | Prisma provides the best experience for your team to work and interact with databases. |
| [Drizzle ORM](https://orm.drizzle.team) | Drizzle ORM is a lightweight and performant TypeScript ORM with developer experience in mind. |
| [TRBC](https://trpc.io) | Experience the full power of TypeScript inference to boost productivity for your full-stack application. |
| [Bcrypt](https://www.npmjs.com/package/bcrypt) | A library to help you hash passwords. |
| [next-i18next](https://github.com/i18next/next-i18next) | The easiest way to translate your NextJs apps. |
| [Tailwind](https://tailwindcss.com) | A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup. |
| [Valibot](https://valibot.dev) | Validate unknown data with Valibot, the open source schema library with bundle size, type safety and developer experience in mind. |
| [Zustand](https://zustand-demo.pmnd.rs) | A small, fast and scalable bearbones state-management solution using simplified flux principles. |
| [Ollama](https://ollama.com) | Get up and running with large language models. |
| [Langchain](https://www.langchain.com) | LangChain is a framework designed to simplify the creation of applications using large language models. |
| [FastAPI](https://fastapi.tiangolo.com) | FastAPI framework, high performance, easy to learn, fast to code, ready for production. |

## 📜 License

This software is licensed under the [MIT](https://github.com/Faris-abukhader/faris-social-media-app/blob/main/LICENSE) © [FaRiS](https://github.com/Faris-abukhader).

