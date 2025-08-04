namespace Mappings
{
    public class UserRoleVM
    {
        public Guid Oid { get; set; }
        public string RoleName { get; set; } = null!;
        public string TargetType { get; set; } = null!;
        public bool IsAdministrative { get; set; }
        public bool ReadState { get; set; }
        public bool WriteState { get; set; }
        public bool CreateState { get; set; }
        public bool DeleteState { get; set; }
        public bool NavigateState { get; set; }

    }
}
