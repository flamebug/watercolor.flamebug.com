using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace watercolor.flamebug.com.Controllers
{
    public class StyledController : Controller
    {
        public IActionResult Forms()
        {
            return View();
        }

        public IActionResult Table()
        {
            return View();
        }

        public IActionResult Typography()
        {
            return View();
        }
    }
}
