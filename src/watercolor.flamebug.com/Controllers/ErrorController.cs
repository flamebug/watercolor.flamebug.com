using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.WebUtilities;

using watercolor.flamebug.com.Models;

namespace watercolor.flamebug.com.Controllers
{
    [Route("Error")]
    public class ErrorController : Controller
    {
        [Route("{id?}")]
        public IActionResult Index(int id = 0)
        {         
            if (id == 0)
                return View(new Error { Status = "Kablammo!!!", Description = "We're sorry, we'll try harder next time!" });

            return View(new Error { Status = id.ToString() + " - " + ReasonPhrases.GetReasonPhrase(id), Description = "We're sorry, we'll try harder next time!" });
        }
    }
}
