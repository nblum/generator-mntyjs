# generator-mntyjs


> Yeoman generator for an easy setup of mntyjs projects


## Usage

Install `yo`, `grunt-cli`, `bower`:
```
    npm install -g grunt-cli bower yo
```

Download or clone the repository and change to the directory.
And link the npm package:
```
    sudo npm link
```


Make a new directory and change to it:
```
    mkdir my-new-project && cd $_
```

Run the generator
```
    yo mntyjs [app-name]
```

Current development use the commands:
```
    #building production files
    grunt build
    
    #watching style changes
    grunt watch
```
