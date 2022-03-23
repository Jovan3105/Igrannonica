using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data

{
    public class UserContext : DbContext
    {

        public UserContext(DbContextOptions<UserContext> options) : base(options)
        { }
        public DbSet<User> Users {  get; set; }
       }


    }

