class Reader extends React.Component {
  state = {
    posts: []
  };

  componentDidMount() {
    var urls = [
      `https://www.engadget.com/rss.xml`,
      `https://www.theverge.com/rss/index.xml`
    ];

    urls.forEach(url => {
      console.log(url)
      this.fetchPosts(url).then(this.parsePosts);
    });
  }

  fetchPosts = url => axios.get(url);

  parsePosts = response => {
    console.log(response);
    var postList = [];
    var domParser = new DOMParser();
    let doc = domParser.parseFromString(response.data, "text/xml");
    console.log(doc);

    if (doc.querySelectorAll("item").length) { console.log(11111111)
      doc.querySelectorAll("item").forEach(item => {
        postList.push({
          title: item.querySelector("title").textContent,
          href: item.querySelector("link").textContent,
          desc: item.querySelector("description").textContent,
          date: item.querySelector("pubDate").textContent
        });
      });
    } else if (doc.querySelectorAll("entry").length) { console.log(33333)
      doc.querySelectorAll("entry").forEach(item => {
        postList.push({
          title: item.getElementsByTagName("title")[0].textContent,
          href: item.getElementsByTagName("link")[0].textContent,
          desc: item.getElementsByTagName("content")[0].textContent,
          date: item.getElementsByTagName("published")[0].textContent
        });
      });
    }

    console.log(this.state.posts)

    if (postList.length) {
      this.setState({
        posts: this.state.posts.concat(postList)
      });
      console.log(this.state.posts.length);
    }
  };

  render() {
    return (
      <div>
        <h1>Engadget</h1>
        <hr />
        {this.state.posts.map((p, i) => (
          <div className="article" key={i}>
            <h1>{i}
              <a target="blank" href={p.href}>
                {p.title}
              </a>
            </h1>
            <p>Date: {p.date}</p>
            <div
              className="description clearfix"
              dangerouslySetInnerHTML={{ __html: p.desc }}
            />
          </div>
        ))}
      </div>
    );
  }
}

ReactDOM.render(<Reader />, document.getElementById("app"));
