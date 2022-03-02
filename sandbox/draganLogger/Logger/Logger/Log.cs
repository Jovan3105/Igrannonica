using System;

namespace Logger
{
    public class Log
    {
        public Log(int id, string naziv, string opis, string date)
        {
            Id = Id;
            Naziv = naziv;
            Opis = opis;
            Date = date;
        }
        public int Id { get; set; }
        public string Date { get; set; }

        public String Opis { get; set; }

        public string Naziv { get; set; }

    }
}