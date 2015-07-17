using Microsoft.AspNet.Mvc;

namespace watercolor.flamebug.com.Controllers
{
    [Route("/[action]")]
    public class HomeController : Controller
    {
        [Route("/")]
        public IActionResult Index()
        {
            return View();
        }
        
        public IActionResult Controls()
        {
            return View();
        }

        public IActionResult Forms()
        {
            return View();
        }

        public IActionResult Start()
        {
            return View();
        }
        
        public IActionResult Layout()
        {
            return View();
        }

        public IActionResult Overview()
        {
            return View();
        }

        public IActionResult Tables()
        {
            return View();
        }

        public IActionResult Typography()
        {
            return View();
        }
        
        public IActionResult Doc()
        {
            return Redirect(Url.Content( "/doc/index.html" ));
        }
    }
}
