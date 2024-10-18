# Todo list api

Esta é uma `RESTful API` para gestão de tarefas.

### Project Structure

<pre><font color="#729FCF"><b>src</b></font>
├── app.ts
├── <font color="#729FCF"><b>controllers</b></font>
│   ├── task.ts
│   └── user.ts
├── <font color="#729FCF"><b>lib</b></font>
│   ├── data.ts
│   └── jose.ts
├── <font color="#729FCF"><b>models</b></font>
│   ├── con.ts
│   ├── schemas.ts
│   ├── task.ts
│   ├── token.ts
│   └── user.ts
└── <font color="#729FCF"><b>views</b></font>
    ├── task.ts
    └── user.ts

4 directories, 12 files
</pre>

### Endpoints da REST API

> CONTAS DE USUÁRIOS :))
- <strong>POST</strong>
  
  `/user/register`
    ```JSON 
    // request body
    {
      "username": "root",
      "pwd": "toor",
      "bio": "powerful user" // this is optional
    }
    ```

  `/user/login`
    ```JSON 
    // request body
    {
      "username": "root",
      "pwd": "toor",
    }
    ```
