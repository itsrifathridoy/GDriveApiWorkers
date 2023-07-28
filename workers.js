
const authConfig = {
  "client_id": "",
  "client_secret": "",
  "refresh_token": "", // Authorize token
  "expires": undefined
}                                  



function enQuery(data) {
  const ret = [];
  for (let d in data) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
}

async function accessToken() {
  console.log("accessToken");
  if (authConfig.expires == undefined || authConfig.expires < Date.now()) {
      const obj = await fetchAccessToken();
      console.log(obj);
      if (obj.access_token != undefined) {
          authConfig.accessToken = obj.access_token;
          authConfig.expires = Date.now() + 3500 * 1000;
      }
  }
  return authConfig.accessToken;
}

async function fetchAccessToken() {
  console.log("fetchAccessToken");
  const url = "https://www.googleapis.com/oauth2/v4/token";
  const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
  };
  const post_data = {
      'client_id': authConfig.client_id,
      'client_secret': authConfig.client_secret,
      'refresh_token': authConfig.refresh_token,
      'grant_type': 'refresh_token'
  }
  

  let requestOption = {
      'method': 'POST',
      'headers': headers,
      'body': enQuery(post_data)
  };

  const response = await fetch(url, requestOption);
  return await response.json();
}




addEventListener("fetch",event => {
  event.respondWith(handleRequest(event.request));
});


async function handleRequest(req)
{

    let url=new URL(req.url);
  
         const { searchParams } = new URL(req.url)
         let id = searchParams.get('id');
         let dId = searchParams.get('dId');
         //let dir = searchParams.get('dir');
         let download = searchParams.get('download')
         let reqUrl;
         if(download=='true')
         {
           download = "alt=media"
         }
         if(dId !=null)
         {
             reqUrl =`https://www.googleapis.com/drive/v3/files?includeItemsFromAllDrives=true&supportsAllDrives=true&q='${dId}'%20in%20parents%20and%20trashed%20%3D%20false%20AND%20name%20!%3D'.password'&orderBy=folder%2Cname%2CmodifiedTime%20desc&fields=nextPageToken%2C%20files(id%2C%20name%2C%20mimeType%2C%20size%20%2C%20modifiedTime%2C%20thumbnailLink%2C%20description)&pageSize=50`
         }
         else
         {
           reqUrl = `https://www.googleapis.com/drive/v3/files/${id}?${download}`
         }
         const access_token = await accessToken();
         
        // url.href = `https://www.googleapis.com/drive/v3/files?includeItemsFromAllDrives=true&supportsAllDrives=true&q='1-ON-glRZJycY6mdP7fYvtJwXg5decPI3'%20in%20parents%20and%20trashed%20%3D%20false%20AND%20name%20!%3D'.password'&orderBy=folder%2Cname%2CmodifiedTime%20desc&fields=nextPageToken%2C%20files(id%2C%20name%2C%20mimeType%2C%20size%20%2C%20modifiedTime%2C%20thumbnailLink%2C%20description)&pageSize=50`
         url.href = reqUrl;

         

              let request=new Request(url,req);
          console.log(access_token)
                   
                          return fetch(request,
                           {
                             headers: {
   "Content-Type": "application/json",
   "Authorization": `Bearer ${access_token}`
 },
                           })
                    
                              }





