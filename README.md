### Installation 

 - Clone repo
 - go to repo folder
 - Install dependencies
    ``` npm install --save ```
 - Initialize Build
   ``` gulp init```
 - Initialize gulp watcher
    ``` gulp ```
    the watcher will check for changes and update the dist/src files
 - Create minified version
    ``` gulp build ```
    the minified files are in dist/build folder
 -  Run
    start a server pointing dist folder. 
    The way I am using it is:
    I have intalled node module http-server (sudo npm install -g http-server),<br>
  ```
  cd dist
  http-server 
  ```
  localhost:8080 should serve index.html.
 - **Notes:** 
    You have to disable authentication and enable cross-origin requests in the api,
    assuming that you have a local installation of Crowdtruth
    replace the beginning of Crowdtruth/app/controllers/Api/search/apiController with: (with // the changes)
  
  ```php
   
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
	
 -  **Notes 2:**
 	If you have installed Crowdtruth on a url different than  http://localhost (even if you are using a 		different port), go to  src/js/Visualizations/util/util.js and change it 
	 dont forget to gulp again (if you dont have the watcher active)
