using AutoMapper;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Client, ClientDto>().ReverseMap();
        }
    }
}
