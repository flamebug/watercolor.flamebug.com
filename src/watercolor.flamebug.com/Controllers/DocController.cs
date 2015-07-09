using Microsoft.AspNet.Mvc;

namespace watercolor.flamebug.com.Controllers
{
    [Route("Doc/[action]")]
    public class DocController : Controller
    {
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
    }
}
