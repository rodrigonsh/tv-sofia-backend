var $body = q("body")
var $doc = document.documentElement;

function q(selector)
{
  
  var node = document.querySelector(selector)

  if ( node == null ) console.warn("cant select", selector)
  
  return node;
  
}

function storageGet( name, def, ev )
{
  
  var ret = localStorage.getItem(name)
    
  if ( ret == null && undefined !== def )
  {
    ret = def
  }  
  
  if (ev) setTimeout(function(){ emit(ev, ret)  }, 30) 
  return  ret
}

function storageJGet( name, def, ev )
{
  ret = storageGet(name, def);
  
  j = JSON.parse(ret);
  
  if (ev) setTimeout(function(){ emit(ev, j)  }, 30) 

  return j
  
}

function replace(noot, bimbom, donde)
{
  do
  {
    donde = donde.replace(noot, bimbom)
  } while( donde.indexOf(noot) > -1 ) 
  
  return donde
}


function emit(actionName, ev)
{
  var customEvent = new Event( actionName )
  customEvent.originalEvent = ev
  
  console.info( actionName, ev )
  dispatchEvent( customEvent )
}

function create(nome, content)
{
  let el = document.createElement(nome)
  
  if ( undefined != content)
  {
    if ( typeof content == "string" ) el.textContent = content
    else ex.appendChild(content)
  }
  
  return el
}

function getTarget(t, name)
{
  
  if ( ! ( 'dataset' in t ) ) { t.dataset = {} }
  
  while( !( name in  t.dataset ) )
  {
    t = t.parentNode
    
    
    if ( undefined == t )
    {
      console.error("Você está passando o target correto?");
    }
    
    if ( ! ( 'dataset' in t ) ) { t.dataset = {} }
  }
  return t
}


addEventListener("click", function(ev)
{
  
  if (ev.button == 2) return;
  
  //ev.preventDefault()
  //ev.stopPropagation()
  
  var target = ev.srcElement
  
  //console.log('clickhandler ', target)
  
  while( 'hasAttribute' in target )
  {
    
    if (target.hasAttribute("emit"))
    {
      
      var actionName = target.getAttribute("emit")
      emit(actionName, ev)
    }
    
    if ( target.hasAttribute("confirm") )
    {
      if( confirm(_("confirmAction")) )
      {
        emit(target.getAttribute("confirm"), ev)
      }
    }
    
    target = target.parentNode
    
  }

})

function checkBoolean(filter, i)
{
  var teste = 1<<i
  return ( filter & teste ) == teste
}

