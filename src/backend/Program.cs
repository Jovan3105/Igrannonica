using backend;
using backend.Data;
using backend.Models;
using backend.Services;
using backend.WS;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net.WebSockets;
using System.Text;

var MyAllowSpecificOrigins = "MyAllowSpecificOrigins";


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.WithOrigins("*").AllowAnyHeader()
                                                  .AllowAnyMethod();
                      });
    
});
ConfigurationManager configuration = builder.Configuration;
// Add services to the container.
//builder.Services.AddSignalR();
builder.Services.AddControllers();

builder.Services.AddDbContext<UserContext>(options => {
    // User
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
     
});

builder.Services.AddDbContext<DatasetContext>(options => {
    // Dataset
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));

});
//builder.Services.AddIdentity<User, IdentityRole>().AddEntityFrameworkStores<UserContext>().AddDefaultTokenProviders();



builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,

        ValidAudience = configuration["JWT:ValidAudience"],
        ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))

    };
});
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddWebSocketServerConnectionManager();
// Email sender
builder.Services.AddTransient<IEmailSender, EmailSender>();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};




//SOKETI
app.UseWebSockets(webSocketOptions);
app.UseWebSocketServer();





app.UseCors(MyAllowSpecificOrigins);

app.UseRouting();


/*app.UseEndpoints(endpoints =>
{   
    endpoints.MapControllers();
    endpoints.MapHub<SocketHub>("/SocketHub");
});*/

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
