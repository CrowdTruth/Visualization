# Visualization

<h3> Installation </h3>
<ul>  
  <li>
    <h4>Clone repo</h4>
  </li>
  <li>
    <h4>go to repo folder</h4>
  </li>
  <li>
    <h4>Install dependencies</h4>
    npm install --save
  </li>
  <li>
    <h4> Initialize Build </h4>
    gulp init
  </li>
    <li>
    <h4> Initialize gulp watcher </h4>
    gulp <br>
    the watcher will check for changes and update the dist/src files
  </li>
   <li>
    <h4> Create minified version</h4>
    gulp build<br>
    the minified files are in dist/build folder
  </li>
  <li>
    <h4> Run </h4>
    start a server pointing dist folder. 
    The way I am using it is:
    I have intalled node module http-server (sudo npm install -g http-server),<br>
    cd dist<br>
    http-server<br>
    localhost:8080 should serve index.html.<br>
  </li>
  <li>
    <h4> Notes </h4>
    You have to disable authentication and enable cross-origin requests in the api,<br>
    assuming that you have a local installation of Crowdtruth<br>
    replace the beginning of Crowdtruth/app/controllers/Api/search/apiController with: (with // the changes) <br>
  
  ```
   
  public function getIndex()
	{
	  //add the line below
		header('Access-Control-Allow-Origin: *');
		//add the line above
		$c = Input::get('collection', 'Entity');

		$collection = $this->repository->returnCollectionObjectFor($c);
  
		
		//<-----comment out from here
		if(Input::has('authkey')) {
		  $user = \MongoDB\UserAgent::where('api_key', Input::get('authkey'))->first();
		  if(is_null($user)) {
			  	return [ 'error' => 'Invalid auth key: '.Input::get('authkey') ];
		  }
		} elseif(Auth::check()) {
		 	$user = Auth::user();
		} else {
		 	return [ 'error' => 'Authentication required. Please supply authkey.' ];
		}
		$projects = ProjectHandler::getUserProjects($user, Permissions::PROJECT_READ);
		$projectNames = array_column($projects, 'name');
		$collection = $collection->whereIn('project', $projectNames);
    //<-----to here
    
		if(Input::has('match'))
		{
			$collection = $this->processFields($collection);
		}
	
	```
		
</li>
<li> 
	 <h4> Notes 2</h4>
	 If you have installed Crowdtruth on a url different than  http://localhost (even if you are using a different port), <br>
	 go to  src/js/Visualizations/util/util.js and change it <br>
	 dont forget to gulp again (if you dont have the watcher active)
	</li>
</ul>
