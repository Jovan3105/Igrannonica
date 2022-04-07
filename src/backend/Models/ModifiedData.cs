namespace backend.Models
{
    public class ModifiedData
    {
        public int Id { get; set; }

        public Cell[] Edited { get; set; }

        public int[] Deleted { get; set; }
    }
}
