using AutoMapper;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Models;
using WeddingOrganizerAPI.Repositories;

namespace WeddingOrganizerAPI.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _repository;
        private readonly IMapper _mapper;

        public ClientService(IClientRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ClientDto>> GetAllAsync()
        {
            var clients = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ClientDto>>(clients);
        }

        public async Task<ClientDto?> GetByIdAsync(int id)
        {
            var client = await _repository.GetByIdAsync(id);
            return client is null ? null : _mapper.Map<ClientDto>(client);
        }

        public async Task<ClientDto> CreateAsync(ClientDto dto)
        {
            var client = _mapper.Map<Client>(dto);
            await _repository.AddAsync(client);
            return _mapper.Map<ClientDto>(client);
        }

        public async Task UpdateAsync(int id, ClientDto dto)
        {
            var client = await _repository.GetByIdAsync(id);
            if (client is null) throw new Exception("Client not found");

            _mapper.Map(dto, client);
            await _repository.UpdateAsync(client);
        }

        public async Task DeleteAsync(int id)
        {
            var client = await _repository.GetByIdAsync(id);
            if (client is null) throw new Exception("Client not found");

            await _repository.DeleteAsync(client);
        }
    }
}
