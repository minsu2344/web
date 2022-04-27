      // const topics = [
      //   {id: 1, title: 'html', body: 'html is...'},
      //   {id: 2, title: 'css', body: 'css is...'},
      //   {id: 3, title: 'js', body: 'js is...'}
      // ];

      let nextId = 4;
      let selectedId = null;

      function navHandler(e) {
        // 1. 링크가 작동하지 않아야 한다.
        e.preventDefault();
        // 2. 아이디 값을 알아낸다.
        selectedId = Number(e.target.id);
        read();
        control();
      }

      async function nav() {
        document.querySelector('nav>ol').innerHTML = 'Loading...';

        const response = await fetch('http://localhost:3000/topics');
        const topics = await response.json();
        const tag = topics.map(e => `
            <li>
              <a href='/read/${e.id}' id='${e.id}' onclick='navHandler(event)'>
                ${e.title}
              </a>
            </li>`).join('');
          document.querySelector('nav > ol').innerHTML = tag;
      }

      function welcome() {
        document.querySelector('article').innerHTML = `<h2>Welcome</h2>Hello, WEB`;
        selectedId = null;
        control();
      }

      async function read() {
        // 3. 아이디와 일치하는 topics의 원소를 찾는다.
        const response = await fetch('http://localhost:3000/topics/' + selectedId);
        const topic = await response.json();
        // 4. 본문을 만든다.
        const content = `<h2>${topic.title}</h2>${topic.body}`
        // 5. 본문을 출력한다.
        document.querySelector('article').innerHTML = content;
        control();
      }
      
      async function createHandler(e) {
        e.preventDefault();
        const t = e.target.title.value;
        const b = e.target.body.value;

        const response = await fetch('http://localhost:3000/topics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({title: t, body: b})
        })
        const data = await response.json();
        console.log(data);
        nav();
        selectedId = data.id;
        read();
      }

      function create() {
        const content = `
          <form onsubmit="createHandler(event)">
            <p><input type='text' name='title' placeholder='제목'></p>
            <p><textarea name='body' placeholder='본문'></textarea></p>
            <p><input type='submit' value='create'></p>
          </form>
        `;
        document.querySelector('article').innerHTML = content;
      }

      async function updateHandler(e) {
        e.preventDefault();
        const t = e.target.title.value;
        const b = e.target.body.value;

        const response = await fetch('http://localhost:3000/topics/'+selectedId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({title: t, body: b})
        })
        const data = await response.json();
        console.log(data);
        nav();
        selectedId = data.id;
        read();
      }

      async function update() {
          const response = await fetch('http://localhost:3000/topics/' + selectedId);
          const topic = await response.json();
          // Create 기능 복사
          const content = `
            <form onsubmit="updateHandler(event)">
              <p><input type='text' name='title' placeholder='제목' value="${topic.title}"></p>
              <p><textarea name='body' placeholder='본문'>${topic.body}</textarea></p>
              <p><input type='submit' value='update'></p>
            </form>
            `;
            document.querySelector('article').innerHTML = content;

            control();
      }

      async function del() {
        const response = await fetch('http://localhost:3000/topics/'+selectedId, {
          method: 'DELETE',
        })
        const data = await response.json();
        nav();
        selectedId = null; // selectedId 컨텐츠를 삭제했으니 null
        welcome(); // 읽어올 게 없으니 read 없애고 welcome
      }
      
      function control() {
        let contextUI = '';
        if(selectedId !== null) {
          contextUI = `
          <li><a href="/update" onclick="event.preventDefault(); update();">Update</a></li>
          <li><a href="/delete" onclick="event.preventDefault(); del();">Delete</a></li>
        `;}
        document.querySelector('#control').innerHTML = `
          <li><a href="/create" onclick='event.preventDefault(); create();'>Create</a></li>
          ${contextUI}
        `;
      }
      debugger;
      nav();
      welcome();
      control();