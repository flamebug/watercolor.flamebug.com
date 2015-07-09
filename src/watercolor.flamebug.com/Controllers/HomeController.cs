using Microsoft.AspNet.Mvc;

namespace watercolor.flamebug.com.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
