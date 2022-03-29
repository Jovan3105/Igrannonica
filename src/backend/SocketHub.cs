using Microsoft.AspNetCore.SignalR;

namespace backend
{
    public class SocketHub: Hub
    {
        public Task sendSmt(string message)
        {
            Console.WriteLine(message);
            return Clients.All.SendAsync("sendMsg",message); 
        }
        public async IAsyncEnumerable<DateTime> Streaming(CancellationToken cancellationToken)
        {
            while (true)
            {
                yield return DateTime.UtcNow;
                await Task.Delay(1000, cancellationToken);
            }
        }


    }
}
