using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.WebUtilities;

using watercolor.flamebug.com.Models;

namespace watercolor.flamebug.com.Controllers
{
    public class ErrorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Status(int id)
        {
            return View(new Error { Status = id.ToString(), Description = ReasonPhrases.GetReasonPhrase(id) });
        }
    }
}
